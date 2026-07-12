
import { useReducer } from "react";
import Home from "@/components/home";

import getProducts from "@/lib/getProducts";





export default async function Home() {

  // call products function to get the data
  const data = await getProducts();
  

  return (
    <div className="">
      <Home data={data} />
    </div>
  );
}
