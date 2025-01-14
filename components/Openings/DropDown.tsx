import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OpeningsDropdown({ openings, index }) {
  const router = useRouter();
  const [selected, setSelected] = useState(openings[index]);

  const handleChange = (newValue) => {
    if (selected == newValue) {
      return;
    }
    setSelected(newValue);
    router.push(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/openings/${
        newValue.openingId
      }/stages${
        newValue.stageOrder[0] ? `/${newValue.stageOrder[0]}/applicants` : ""
      }`
    );
  };
  return (
    <Listbox value={selected} onChange={handleChange}>
      {/* <Listbox.Label className="block text-lg font-medium text-gray-700">
        Assigned to
      </Listbox.Label> */}
      <div className=" relative w-full ">
        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-lg">
          <div className="flex items-center">
            <span
              aria-label={selected?.isPublic ? "Online" : "Offline"}
              className={classNames(
                selected?.isPublic ? "bg-green-400" : "bg-gray-200",
                "flex-shrink-0 inline-block h-2 w-2 rounded-full"
              )}
            />
            <span className="ml-3 block truncate">{selected?.GSI1SK}</span>
          </div>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="h-5 w-5 text-light" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-lg">
            {openings.map((opening) => (
              <Listbox.Option
                key={opening.openingId}
                className={({ active }) =>
                  classNames(
                    active ? "text-white bg-blue-600" : "text-dark",
                    "cursor-default select-none relative py-2 pl-3 pr-9"
                  )
                }
                value={opening}
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        className={classNames(
                          opening.isPublic ? "bg-green-400" : "bg-gray-200",
                          "flex-shrink-0 inline-block h-2 w-2 rounded-full"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        {opening.GSI1SK}
                        <span className="sr-only">
                          {" "}
                          is {opening.isPublic ? "online" : "offline"}
                        </span>
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          active ? "text-white" : "text-blue-600",
                          "absolute inset-y-0 right-0 flex items-center pr-4"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
