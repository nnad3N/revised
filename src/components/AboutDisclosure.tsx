import { Transition } from "@headlessui/react";
import { ArrowDownRightIcon, ArrowUpLeftIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";

const AboutDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAfterEnter, setIsAfterEnter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isMobile);
    if (buttonRef.current && isMobile) {
      buttonRef.current.classList.remove("group");
    }
  }, []);

  const handleToggleOpen = (e: React.PointerEvent | React.KeyboardEvent) => {
    if (e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " ") {
      return;
    }
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <p>
        Nihil aspernatur error, culpa est praesentium voluptates, rerum saepe
        corporis quibusdam asperiores temporibus inventore. Et eveniet est
        tempora, magni quo dolor.
      </p>
      <Transition
        beforeEnter={() => setIsTransitioning(true)}
        afterEnter={() => {
          setIsTransitioning(false);
          setIsAfterEnter(true);
        }}
        beforeLeave={() => setIsTransitioning(true)}
        afterLeave={() => {
          setIsTransitioning(false);
          setIsAfterEnter(false);
        }}
        show={isOpen}
        unmount={false}
        className="mt-2 h-auto space-y-2 overflow-hidden"
        enter="transition-[max-height] ease-out duration-300"
        enterFrom="max-h-0"
        enterTo="max-h-96"
        leave="transition-[max-height] ease-out duration-200"
        leaveFrom="max-h-96"
        leaveTo="max-h-0"
        aria-expanded={isOpen}
      >
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, amet?
          Delectus qui soluta adipisci distinctio consectetur tempora molestiae?
          Ab aut velit rem voluptate harum placeat, aliquid nihil? Reprehenderit
          possimus saepe inventore in molestias, quos officia ullam maxime odit
          delectus iusto.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, amet?
          Delectus qui soluta adipisci distinctio consectetur tempora molestiae?
          Ab aut velit rem voluptate harum placeat, aliquid nihil? Reprehenderit
          possimus saepe inventore in molestias.
        </p>
      </Transition>
      <button
        ref={buttonRef}
        onPointerDown={handleToggleOpen}
        onKeyDown={handleToggleOpen}
        className={`group mt-3 flex items-center gap-x-1 font-semibold transition-colors hover:text-primary/90 focus-visible:outline-offset-[3px] focus-visible:outline-primary lg:text-lg ${
          isTransitioning ? "pointer-events-none cursor-pointer" : ""
        }`}
        aria-disabled={isTransitioning}
      >
        {isOpen ? "Mniej" : "Więcej"}

        {isAfterEnter ? (
          <ArrowUpLeftIcon
            className={`${
              !isOpen ? "rotate-180" : ""
            } h-6 w-6 transition-transform duration-200 group-hover:rotate-45`}
          />
        ) : (
          <ArrowDownRightIcon
            className={`${
              isOpen ? "rotate-180" : ""
            } h-6 w-6 transition-transform duration-300 group-hover:rotate-45`}
          />
        )}
      </button>
    </>
  );
};

export default AboutDropdown;
