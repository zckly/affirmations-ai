import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full flex-row justify-end p-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="https://wenquai.com"
          target="_blank"
          className="hover:underline"
          rel="noreferrer noopener"
        >
          made by zack
        </Link>
        <Link
          href="https://github.com/zckly/affirmations-ai"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          view on github
        </Link>

        {/* <Link
          href="https://www.buymeacoffee.com/wenquai"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          buy me a coffee
        </Link> */}
      </div>
    </div>
  );
}
