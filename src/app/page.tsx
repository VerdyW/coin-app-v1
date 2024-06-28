import Image from "next/image";
import LoginButton from "./components/landing-page-buttons/LoginButton";
import GetStartedButton from "./components/landing-page-buttons/GetStartedButton";
import { Reveal } from "./components/utils/Reveal";
import GetStartedNavbar from "./components/landing-page-buttons/GetStartedNavbar";

export default function Home() {



  return (
    <main className="flex flex-col w-screen justify-center items-center bg-Secondary-100 h-screen">
      <header className="w-full flex justify-center max-md:relative">
        <div className="flex justify-between items-center h-full mt-[25px] mb-[25px] w-11/12">
          <Reveal>
          <div className="h-12 w-12 bg-Third-950 justify-center text-white font-bold items-center flex">
              <h5 className="font-bold">VW.</h5>
          </div>
          </Reveal>
          <Reveal>
            <GetStartedNavbar/>
          </Reveal>
        </div>
      </header>
      <div className="h-[calc(100vh-calc(98px+30px))] w-10/12 justify-between items-center flex max-sm:flex-col-reverse max-sm:h-full">
        <div className="flex flex-col gap-5 w-full max-sm:h-1/2">
          <Reveal>
            <div className="gap-1 flex flex-col mb-5 max-sm:mb-1">
              <h1 className="text-6xl max-sm:text-3xl">Track Your </h1>
              <h1 className="text-Primary-950 font-bold text-6xl max-sm:text-3xl"> Cryptocurrency </h1> 
              <h1 className="text-6xl max-sm:text-3xl">Portfolio with Ease</h1>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-lg max-sm:text-sm">Stay on top of your cryptocurrency investments and make informed decisions.</p>
          </Reveal>
          <Reveal width="100%">
            <div className="flex gap-8 w-full">
              <GetStartedButton/>
              <LoginButton/>
            </div>
          </Reveal>
        </div>

        
        <div className="w-full h-full flex flex-col justify-center items-center max-sm:h-1/2">
          <Reveal>
            <img src="/App-Mockup.png" alt="appliaction displayed on Laptop" className=" "></img>
          </Reveal>
        </div>
      </div>
      
      <div className="flex items-center justify-center text-center h-[30px] bg-Third-950 w-full mt-8">
        <h1 className="text-white text-sm">© Verdy Wahyudi 2024</h1>
      </div>
      
    </main>
  );
}
