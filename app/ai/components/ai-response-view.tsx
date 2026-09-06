"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, Map, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import SafeMarkdown from "./safe-markdown";
import PropertyResultCard, { PropertyResult } from "./property-result-card";
import PropertyCarouselCard from "./property-carousel-card";
import LocusTake from "./locus-take";
import ComparisonView from "./comparison-view";
import RecommendationCard from "./recommendation-card";
import ActionConfirmation from "./action-confirmation";
import WorkflowProgress, { WorkflowStep } from "./workflow-progress";

type AiResponseViewProps = {
  content: string;
  properties?: PropertyResult[];
  userQuery?: string;
  workflowSteps?: WorkflowStep[];
  workflowState?: "Completed" | "Failed";
  onFollowUpClick?: (prompt: string) => void;
};

// Decompose LLM prose into summary intro, redundant listings block, and Locus Take / Insight
function parseResponseSections(rawContent: string, hasProperties: boolean) {
  if (!rawContent) {
    return { intro: "", insight: "", redundantListRemoved: false };
  }

  // Look for insight markers like "Locus Take:", "My take:", "Takeaway:", "Conclusion:", "Recommendation:"
  const insightRegex = /(?:Locus Take|My Take|Here's my take|My pick|Takeaway|Recommendation|Insight|Conclusion):\s*([\s\S]+)$/i;
  const insightMatch = rawContent.match(insightRegex);

  let insight = "";
  let body = rawContent;

  if (insightMatch) {
    insight = insightMatch[1].trim();
    body = rawContent.slice(0, insightMatch.index).trim();
  }

  if (!hasProperties) {
    return {
      intro: body,
      insight,
      redundantListRemoved: false,
    };
  }

  // If we have structured property cards, we should strip raw repetitive lists of properties like:
  // 1. **5 BHK Apartment** ...
  // * **Title** ...
  const lines = body.split("\n");
  const introLines: string[] = [];
  let foundListingStart = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line looks like the start of a property listing in a list
    const isNumberedProperty = /^\d+\.\s+(\*\*)?[A-Za-z0-9\s]+(\*\*)?/.test(trimmed);
    const isBulletedProperty = /^[-*]\s+(\*\*)?[A-Za-z0-9\s]+(\*\*)?/.test(trimmed) && trimmed.includes("BHK");

    if (isNumberedProperty || isBulletedProperty) {
      foundListingStart = true;
      continue;
    }

    if (!foundListingStart) {
      introLines.push(line);
    }
  }

  const intro = introLines.join("\n").trim();

  return {
    intro: intro || (foundListingStart ? body.split("\n")[0] : body),
    insight,
    redundantListRemoved: foundListingStart,
  };
}

// Extract reasons for recommendation from prose
function extractRecommendationReasons(content: string, property: PropertyResult): string[] {
  const reasons: string[] = [];

  // Look for bullet points or comma separated features in the text
  const bulletMatches = content.match(/[-*•]\s+([^\n]+)/g);
  if (bulletMatches && bulletMatches.length > 0) {
    bulletMatches.slice(0, 4).forEach((m) => {
      const cleaned = m.replace(/^[-*•]\s+/, "").trim();
      if (cleaned.length > 5 && !cleaned.toLowerCase().includes("locus take")) {
        reasons.push(cleaned);
      }
    });
  }

  if (reasons.length === 0) {
    if (property.price) {
      reasons.push(
        property.listingType === "RENT"
          ? "Competitive monthly rental rate for this sector"
          : "Excellent value per square foot in this location"
      );
    }
    if (property.bedrooms) {
      reasons.push(`Spacious ${property.bedrooms} BHK configuration`);
    }
    if (property.furnished) {
      reasons.push("Fully furnished and move-in ready");
    }
    if (property.bathrooms) {
      reasons.push(`${property.bathrooms} full bathrooms for comfort`);
    }
  }

  return reasons.slice(0, 4);
}

export default function AiResponseView({
  content,
  properties = [],
  userQuery = "",
  workflowSteps,
  workflowState,
  onFollowUpClick,
}: AiResponseViewProps) {
  const hasProperties = properties.length > 0;
  const lowerContent = content.toLowerCase();
  const lowerQuery = userQuery.toLowerCase();

  // 1. Detect Viewing Confirmation
  const isViewingAction =
    lowerContent.includes("viewing request") ||
    lowerContent.includes("viewing has been scheduled") ||
    lowerContent.includes("viewing scheduled") ||
    (lowerContent.includes("scheduled a viewing") && lowerContent.includes("status"));

  // 2. Detect Inquiry Confirmation
  const isInquiryAction =
    lowerContent.includes("inquiry sent") ||
    lowerContent.includes("inquiry has been sent") ||
    lowerContent.includes("message has been sent to the owner") ||
    lowerContent.includes("contacted the seller");

  // 3. Detect Favorite Confirmation
  const isFavoriteAction =
    (lowerContent.includes("saved to your favorites") ||
      lowerContent.includes("added to your favorites") ||
      lowerContent.includes("removed from your favorites")) &&
    properties.length <= 1;

  // 4. Detect Comparison
  const isComparison =
    properties.length >= 2 &&
    (lowerQuery.includes("compare") ||
      lowerQuery.includes(" vs ") ||
      lowerQuery.includes("versus") ||
      lowerQuery.includes("difference") ||
      lowerContent.includes("comparison") ||
      lowerContent.includes("comparing"));

  // 5. Detect Recommendation / Best Match
  const isRecommendation =
    properties.length >= 1 &&
    !isComparison &&
    (lowerQuery.includes("recommend") ||
      lowerQuery.includes("best match") ||
      lowerQuery.includes("top pick") ||
      lowerQuery.includes("which one should") ||
      lowerQuery.includes("rank") ||
      lowerContent.includes("my recommendation") ||
      lowerContent.includes("best match") ||
      lowerContent.includes("top recommendation"));

  // Parse prose into clean sections
  const { intro, insight } = useMemo(
    () => parseResponseSections(content, hasProperties),
    [content, hasProperties]
  );

  return (
    <div className="space-y-2 text-xs sm:text-sm">
      {/* Header: Locus AI Identity */}
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#b8924a]">
        <Sparkles size={11} className="text-[#b8924a]" />
        <span>Locus AI</span>
      </div>

      {/* AGENT WORKFLOW VISIBILITY */}
      {workflowSteps && workflowSteps.length > 0 && (
        <WorkflowProgress steps={workflowSteps} workflowState={workflowState} />
      )}

      {/* 1. AI CONTEXT / SUMMARY */}
      {intro && (
        <div className="text-xs sm:text-sm text-[#1e1b17] leading-relaxed">
          <SafeMarkdown content={intro} />
        </div>
      )}

      {/* 2. STRUCTURED RESULTS BASED ON TOOL INTENT */}

      {/* A. Viewing Appointment Confirmation */}
      {isViewingAction && (
        <ActionConfirmation
          type="viewing"
          title="Viewing request created!"
          subtitle="We've sent a request to the seller. You'll be notified once it's confirmed."
          property={properties[0]}
          viewingDetails={{
            dateTime: "Upcoming Appointment",
            status: "REQUESTED",
          }}
        />
      )}

      {/* B. Favorite Action Confirmation */}
      {isFavoriteAction && (
        <ActionConfirmation
          type="favorite"
          title={
            lowerContent.includes("removed")
              ? "Removed from favorites"
              : "Saved to your favorites!"
          }
          property={properties[0]}
        />
      )}

      {/* C. Inquiry Action Confirmation */}
      {isInquiryAction && (
        <ActionConfirmation
          type="inquiry"
          title="Inquiry sent successfully!"
          property={properties[0]}
        />
      )}

      {/* D. Comparison View */}
      {isComparison && (
        <ComparisonView
          properties={properties}
          conclusion={insight || (intro !== content ? undefined : undefined)}
        />
      )}

      {/* E. Recommendation / Best Match View */}
      {isRecommendation && properties[0] && (
        <div className="space-y-2">
          <RecommendationCard
            property={properties[0]}
            reasons={extractRecommendationReasons(content, properties[0])}
            followUpPrompt="Want me to find similar options in a different budget range?"
            onFollowUpClick={onFollowUpClick}
          />
          {/* If there are runner-up properties, show them as compact cards */}
          {properties.length > 1 && (
            <div className="pt-1">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
                Other Notable Candidates:
              </p>
              <div className="space-y-1.5">
                {properties.slice(1, 3).map((prop) => (
                  <PropertyResultCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* F. Standard Search Property Cards — Horizontal Carousel matching Design Board */}
      {!isViewingAction &&
        !isFavoriteAction &&
        !isInquiryAction &&
        !isComparison &&
        !isRecommendation &&
        hasProperties && (
          <div className="pt-1 space-y-2.5">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x -mx-1 px-1">
              {properties.map((property) => (
                <PropertyCarouselCard key={property.id} property={property} />
              ))}
            </div>

            {/* Quick Action Pills matching Right Screen of design board */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Link
                href="/properties?view=map"
                className="locus-touch inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs font-medium text-[#1e1b17] shadow-2xs hover:border-[#b8924a] shrink-0"
              >
                <Map size={13} className="text-[#b8924a]" />
                <span>Show on Map</span>
              </Link>

              <button
                type="button"
                onClick={() => onFollowUpClick?.("Sort these properties by price")}
                className="locus-touch inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs font-medium text-[#1e1b17] shadow-2xs hover:border-[#b8924a] shrink-0"
              >
                <ArrowUpDown size={13} className="text-[#b8924a]" />
                <span>Sort by Price</span>
              </button>

              <Link
                href="/properties"
                className="locus-touch inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs font-medium text-[#1e1b17] shadow-2xs hover:border-[#b8924a] shrink-0"
              >
                <SlidersHorizontal size={13} className="text-[#b8924a]" />
                <span>More Filters</span>
              </Link>
            </div>
          </div>
        )}

      {/* 3. AI INSIGHT / LOCUS TAKE (if not already rendered inside ComparisonView) */}
      {!isComparison && insight && (
        <LocusTake insight={insight} />
      )}
    </div>
  );
}
