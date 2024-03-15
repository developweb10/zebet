import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: '[appHighlight]'
  })
  export class HighlightDirective {
  
    constructor(private el: ElementRef) { }
  
    @Input('appHighlight') highlightColor: string;
  
    @HostListener('mouseover') onMouseover() {
      this.highlight('rounded-tl rounded-bl w-10 justify-center flex p-1 odd-yellow');
    }
    @HostListener('mouseout') onMouseout() {
      this.highlight('rounded-tl rounded-bl bg-gray-500 w-10 justify-center flex p-1');
    }
    
  
    private highlight(color: string) {
      this.el.nativeElement.class = color;
    }
  }
  