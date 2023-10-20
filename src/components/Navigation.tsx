import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Logo from "./Logo.tsx";

const links = [
  {
    name: "O Nas",
    href: "#about",
  },
  {
    name: "Usługi",
    href: "#services",
  },
  {
    name: "Portfolio",
    href: "#portfolio",
  },
];

const Navigation = () => {
  return (
    <div className="flex w-full justify-center lg:mt-4 lg:px-8">
      <nav className="h-18 z-20 grid w-full max-w-sm grid-cols-2 items-center justify-between px-4 pb-0 pt-8 sm:max-w-7xl sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:rounded-full lg:bg-primary lg:px-12 lg:py-3 xl:px-16">
        <a
          className="w-max focus-visible:outline-offset-4 focus-visible:outline-primary"
          href="/"
          aria-label="Strona Główna"
        >
          <Logo
            bodyFill="dark"
            dotFill="dark"
            className="lg:fill-neutral-100 lg:[&>circle]:fill-neutral-100"
            size={24}
          />
        </a>
        <div className="hidden gap-x-8 justify-self-center text-lg text-neutral-100 lg:flex">
          {links.map(({ name, href }, index) => (
            <a
              key={index}
              className="px-2 py-1 transition-colors duration-150 hover:text-neutral-300"
              href={href}
            >
              {name}
            </a>
          ))}
        </div>
        <div className="flex gap-x-4 justify-self-end">
          <button className="col-span-2 h-10 w-max rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent lg:duration-150 lg:hover:bg-neutral-200 lg:hover:text-primary">
            Umów spotkanie
          </button>
          <MobileNav />
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

const MobileNav = () => {
  return (
    <Popover as="div" className="relative lg:hidden">
      {({ open }) => (
        <>
          <Popover.Button
            aria-label="Otwórz menu nawigacji"
            className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full text-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary ui-not-focus-visible:outline-none"
          >
            {open ? (
              <XMarkIcon className="text-red h-6 w-6" />
            ) : (
              <Bars3Icon className="text-red h-6 w-6" />
            )}
          </Popover.Button>
          <Transition>
            <Transition.Child
              as={Popover.Overlay}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="fixed inset-0 bg-neutral-700/5 backdrop-blur-sm"
            />

            <div className="fixed inset-0 mt-16 p-4 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel
                  as="div"
                  className="mx-auto flex w-full max-w-sm transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 text-left align-middle shadow-xl ring-1 ring-neutral-900/5 transition-all focus:outline-none"
                >
                  {links.map(({ name, href }, index) => (
                    <a
                      key={index}
                      className="p-2 text-lg ui-focus-visible:outline-accent"
                      href={href}
                    >
                      {name}
                    </a>
                  ))}
                </Popover.Panel>
              </Transition.Child>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  );
};
