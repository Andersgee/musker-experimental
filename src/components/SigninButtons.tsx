"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { IconDiscord } from "src/icons/Discord";
import { IconGithub } from "src/icons/Github";
import { IconGoogle } from "src/icons/Google";

/**
 * check /api/auth/providers for a list of configured providers
 */
export const providers = {
  discord: { id: "discord", name: "Discord" },
  github: { id: "github", name: "GitHub" },
  google: { id: "google", name: "Google" },
};

type SignInButtonsProps = {
  className?: string;
};

/**
 * Keep same look (light mode) always.
 */
export function SigninButtons({ className = "" }: SignInButtonsProps) {
  const onClick = (providerId: string) => () => {
    signIn(providerId);
  };

  return (
    <div className={`flex w-full justify-center ${className}`}>
      <div className="bg-white p-4">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={onClick(provider.id)}
              className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
            >
              <ProviderIcon name={provider.name} className="mr-1 h-7" />
              <span>Sign in with {provider.name}</span>
            </button>
          </div>
        ))}
        <p className="mt-3 w-64 text-center text-sm text-neutral-600 dark:text-neutral-600">
          By signing in, you agree to our <br />
          <Link
            className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

type ProviderIconProps = {
  name: string;
  className?: string;
};

export function ProviderIcon({ name, className = "" }: ProviderIconProps) {
  if (name === "GitHub") {
    return <IconGithub width={32} height={32} className={className} />;
  } else if (name === "Discord") {
    return <IconDiscord width={38} height={32} className={className} />;
  } else if (name === "Google") {
    return <IconGoogle width={32} height={32} className={className} />;
  } else {
    return <div>{name}</div>;
  }
}
