import Graphics from "./Components/graphics";
import PictogramsChart from "./Components/pictograms";
import UserCards from "./Components/user";

const Home = () => {
  return (
   <div className="flex flex-col ">
     <UserCards/>
    

    <div className=" flex gap-2 items-center justify-around">
    <Graphics/>

<PictogramsChart/>
    </div>

   </div>
  );
};

export default Home;
