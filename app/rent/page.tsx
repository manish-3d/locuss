import PropertiesPage from "@/app/properties/page";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function RentPage({ searchParams }: Props) {
  const params = await searchParams;
  
  // Reuse the main properties discovery page, but force listingType to RENT
  return (
    <PropertiesPage 
      searchParams={Promise.resolve({ ...params, listingType: "RENT" })} 
    />
  );
}
