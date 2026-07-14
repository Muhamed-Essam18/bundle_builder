

import getProducts from "@/lib/getProducts";
import HomeComponent from "@/components/home";

export const dynamic = "force-dynamic";

export default async function Home() {

  // call products function to get the data
  const data = await getProducts();
  

  return (
    <div className="">
      <HomeComponent data={data} />
    </div>
  );
}
