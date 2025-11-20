
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white">
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold">Welcome to GameDay</h1>
          <p className="mt-4 text-lg md:text-xl">Your ultimate gaming companion</p>
          <Link href="/games" className="mt-8 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
            Get Started
          </Link>
        </div>
      </div>

      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border border-gray-700 rounded-lg">
            <div className="text-5xl mb-4">ð🎮</div>
            <h3 className="text-2xl font-bold mb-2">Game Discovery</h3>
            <p>Find new and exciting games to play, tailored to your interests.</p>
          </div>
          <div className="p-8 border border-gray-700 rounded-lg">
            <div className="text-5xl mb-4">ð🏆</div>
            <h3 className="text-2xl font-bold mb-2">Tournament Creation</h3>
            <p>Create and manage your own gaming tournaments with ease.</p>
          </div>
          <div className="p-8 border border-gray-700 rounded-lg">
            <div className="text-5xl mb-4">ð👕</div>
            <h3 className="text-2xl font-bold mb-2">Merch Store</h3>
            <p>Get your hands on exclusive GameDay merchandise.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
