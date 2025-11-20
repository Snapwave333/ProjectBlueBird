
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="text-2xl font-bold">
          GameDay
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/games">
              Games
            </Link>
          </li>
          <li>
            <Link href="/tournaments">
              Tournaments
            </Link>
          </li>
          <li>
            <Link href="/merch">
              Merch
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
