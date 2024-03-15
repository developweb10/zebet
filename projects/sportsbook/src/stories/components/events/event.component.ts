import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { User } from '../../User';

@Component({
  selector: 'storybook-event',
  template: `<div
    class="bg-[#18242a] rounded border-gray-800 text-[11px] font-medium text-white flex gap-2 p-2 mb-2"
  >
    <div
      class="text-[#a3a7aa] text-[11px] w-12 shrink-0 text-center pr-1 border-r-2 border-[#2C3538]"
    >
      <!-- {{ eventId }} -->
      200462
    </div>
    <div
      class="text-[#a3a7aa] text-[11px] w-11 shrink-0 text-center pr-1 border-r-2 border-[#2C3538]"
    >
      17:05 23/05
    </div>
    <div class="w-full">
      <div class="uppercase text-[12px]">
        <!-- {{events.name}} -->
        Real Madrid <span class="text-[#ffc600]"> VS </span> Barcelona
      </div>
      <div class="flex space-x-2">
        <div
          class="pr-1 border-r-2 border-[#2C3538] uppercase text-[#a3a7aa] text-[11px] mt-2"
        >
          <!-- {{ homeTeam }} VS {{ awayTeam }} -->
          POLAND - III LIGA, GROUP 3
        </div>

        <img
          class="h-min flex justify-center items-center mt-2"
          src="./../../../assets/img/game_signal.png"
        />
      </div>
    </div>
    <div class="flext shrink-0 mt-2">
      <img src="./../../../assets/img/Star.png" />
    </div>
    <div>
      <div class="flex gap-2 text-[11px]">
        <div class="flex gap-0.5 h-min">
          <div
            [className]="
              'rounded-tl rounded-bl bg-[#4d585d] w-10 justify-center flex p-2 cursor-pointer hover:bg-yellow-500 hover:text-black'
            "
          >
            2.05
            <div class="pl-1 flex justify-center items-center">
              <img src="./../../../assets/img/game_up_arrow.png" />
            </div>
          </div>
          <div
            class="bg-[#4d585d] w-10 justify-center flex p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            1.97
            <div class="pl-1 flex justify-center items-center">
              <img src="./../../../assets/img/game_down_arrow.png" />
            </div>
          </div>
          <div
            class="rounded-tr rounded-br bg-[#4d585d] w-10 text-center p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            1.56
          </div>
        </div>
        <div class="flex gap-0.5 h-min">
          <div
            class="rounded-tl rounded-bl bg-[#4d585d] w-10 justify-center flex p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            1.15
          </div>
          <div
            class="bg-[#4d585d] w-10 justify-center flex p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            1.15
          </div>
          <div
            class="rounded-tr rounded-br bg-[#4d585d] w-10 text-center p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            3.02
          </div>
        </div>
        <div class="flex gap-0.5 h-min">
          <div
            class="rounded-tl rounded-bl bg-[#4d585d] w-10 justify-center flex p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            2.00
          </div>
          <div
            class="rounded-tr rounded-br bg-[#4d585d] w-10 text-center p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
          >
            24.07
          </div>
        </div>
      </div>
      <div class="flex justify-end py-1 px-2">
        <p class="text-xs text-[#ffc600]">+72 Markets</p>
        <div class="pl-1 pt-1">
          <img src="./../../../assets/img/Vector.png" />
        </div>
      </div>
    </div>
  </div> `,
  styleUrls: ['./events.css'],
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
