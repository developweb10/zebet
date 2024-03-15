import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { User } from '../../User';

@Component({
  selector: 'storybook-events',
  template: `<div
    class="flex flex-wrap justify-between bg-[#18242a] rounded relative my-1 py-2 w-[1/2]"
  >
    <div class="w-1/2 flex flex-wrap px-1 py-1 gap-2">
      <div class="mb-3">
        <div class="flex w-full divide-x-2 divide-gray-400 mb-1">
          <div class="text-zinc-400 text-[12px] font-medium leading-none pr-1">
            200462
          </div>
          <div class="text-zinc-400 text-[12px] font-medium leading-none pl-1">
            15:15 28/10
          </div>
        </div>
        <div class="h-8 w-full">
          <span class="text-white text-xs font-medium leading-none uppercase"
            >Barcelona </span
          ><span class="text-yellow-400 text-xs font-medium leading-none"
            >VS </span
          ><span class="text-white text-xs font-medium leading-none uppercase"
            >Real Madrid</span
          >
        </div>
      </div>

      <div class="flex w-full divide-x-2 divide-gray-400">
        <div
          class="pr-1 text-zinc-400 text-xs font-normal leading-none uppercase"
        >
          POLAND GROUP 3
        </div>
        <div class="pl-1 leading-none">
          <img src="./../../../assets/img/game_signal.png" />
        </div>
      </div>
    </div>
    <div class="px-2 py-2 pt-3">
      <div class="flex flex-col">
        <div class="flex space-x-1 flex-wrap float-right justify-end">
          <div
            [className]="
              'flex flex-wrap px-2 rounded-md py-4 text-[12px] font-medium leading-none  bg-[#4d5854] text-white hover:bg-yellow-500 hover:text-black cursor-pointer'
            "
          >
            2.05
            <div class="pl-1 flex justify-center items-center">
              <img src="./../../../assets/img/game_up_arrow.png" />
            </div>
          </div>
          <div
            [className]="
              'flex flex-wrap text-white bg-[#4d5854] px-2 rounded-md py-4 text-[12px] font-medium leading-none hover:bg-yellow-500 hover:text-black cursor-pointer'
            "
          >
            1.92
            <div class="pl-1 flex justify-center items-center">
              <img src="./../../../assets/img/game_down_arrow.png" />
            </div>
          </div>
          <div
            class="flex flex-wrap text-white bg-[#4d5854] px-2 rounded-md py-4 text-[12px] font-medium leading-none hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            4.00
            <div class="pl-1 flex justify-center items-center">
              <img src="./../../../assets/img/game_up_arrow.png" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <div class="mt-8">
            <img src="./../../../assets/img/Star.png" />
          </div>

          <button class="flex mt-6 bg-[#4d585d] rounded-2xl py-1 px-2">
            <p class="text-xs text-[#ffc600]">+72 Markets</p>
            <div class="pl-1 pt-1">
              <img src="./../../../assets/img/Vector.png" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="w-6 h-4 text-zinc-400 text-xs font-medium leading-none absolute left-2 top-2">5840</div>
    <div class="h-4 text-zinc-400 text-xs font-medium leading-none absolute left-10 top-2">10:30  21/08</div> -->
  </div>`,
  styleUrls: ['./events-mobile.css'],
})
export default class EventComponent {
  @Input()
  user: User | null = null;

  @Output()
  onLogin = new EventEmitter<Event>();

  @Output()
  onLogout = new EventEmitter<Event>();

  @Output()
  onCreateAccount = new EventEmitter<Event>();
}
