import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Event } from "../config/db";
import { MapPinIcon, TrashIcon, Bars3BottomLeftIcon, XMarkIcon, ClockIcon } from "@heroicons/react/20/solid";
import { isSameDay } from "date-fns";
import NepaliDate from "nepali-date-converter";
import nepaliNumber from "../helper/nepaliNumber";
import mahina from "../constants/mahina";

export default function MyModal({
  modalOpen,
  onClose,
  event,
}: {
  modalOpen: boolean;
  onClose: ()=>void;
  event: Event;
}) {
  const [isOpen, setIsOpen] = useState(modalOpen);
  const durationInsidePopup = (event: Event) => {
    if (event.start.date && event.end.date) {
      //it is a whole day
      const startDate = new NepaliDate(new Date(event.start.date));
      return ` ${nepaliNumber(startDate.getDate().toString()) + "/" +mahina( Number(startDate.getMonth()))}`
    }else if (event.start.dateTime && event.end.dateTime) {
      const startDate = new NepaliDate(new Date(event.start.dateTime));
      const endDate = new NepaliDate(new Date(event.end.dateTime));
      if (!isSameDay(new Date(event.start.dateTime), new Date(event.end.dateTime)))
        return `${nepaliNumber(startDate.getDate().toString()) + "/" +mahina( Number(startDate.getMonth()))} - ${
          nepaliNumber(endDate.getDate().toString()) + "/" + mahina(Number(endDate.getMonth() ))
        }`;
      else return `${nepaliNumber(startDate.getDate().toString())}  / ${mahina(startDate.getMonth())}`;
    }
    return "";
  };

  function closeModal() {
    onClose();
  }
  const deleteEvent = async () => {
    await fetch(`/api/delete/${event.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    <div className="title  border-bordersubtle flex items-center  justify-between border-b py-3 text-center">
                      <div>
                        <h1 className="font-medium">{event.summary}</h1>
                        {durationInsidePopup(event).length > 0 && (
                          <div className="time flex gap-3 text-left text-sm text-gray-500 ">
                            <ClockIcon className="h-5 w-5" />
                            <h1>{durationInsidePopup(event)}</h1>
                          </div>
                        )}
                      </div>

                      <XMarkIcon onClick={onClose} className="h-6 w-6 rounded-full   hover:bg-hovercolor" />
                    </div>
                  </Dialog.Title>
                  {event.description && (
                    <div className="mt-2 flex gap-2">
                      <Bars3BottomLeftIcon className="h-6 w-6" />
                      <p className=" text-gray-500">{event.description}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="event__details py-2">
                      {event.location && (
                        <div className="location flex w-full items-center gap-2 py-1">
                          <MapPinIcon className="h-6 w-6" />
                          <h1 className="text-gray-500"> {event.location}</h1>
                        </div>
                      )}
                      <div
                        onClick={() => {
                          deleteEvent();
                          onClose();
                        }}
                        className="delete__button absolute  bottom-2 right-3 ml-auto flex  max-w-[140px] cursor-pointer items-center justify-center gap-1 rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2  focus:ring-indigo-500 focus:ring-offset-2">
                        <h1>Delete</h1>
                        <TrashIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
