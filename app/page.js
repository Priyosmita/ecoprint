import Image from "next/image";
import Header from "./components/Header";
import GlobeComponent from "./components/Globe";

export default function Home() {
  
  return (
    <div>
      <Header
        title="Eco Print"
        actions={
          <>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">Signin </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-full">Signup </button>
          </>
        }
      />
      <main className="mt-20 p-4">
        <GlobeComponent/>
        
      </main>
    </div>
  );
}
