import PropertiesPage from "@/app/properties/page";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function BuyPage({ searchParams }: Props) {
  const params = await searchParams;
  
  // Reuse the main properties discovery page, but force listingType to SALE
  return (
    <PropertiesPage 
      searchParams={Promise.resolve({ ...params, listingType: "SALE" })} 
    />
  );
}
