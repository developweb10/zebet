import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-affiliate-program',
  templateUrl: './affiliate-program.component.html',
  styleUrls: ['./affiliate-program.component.css']
})
export class AffiliateProgramComponent implements OnInit {
  form: FormGroup;
  showMenu: boolean = false;
  activeSection: string = 'home';
  
  ngOnInit(): void {
    this.buildForm();
  }
  constructor(private formBuilder: FormBuilder,private el: ElementRef) { }


  
  send(): void {
    const { name, email, message } = this.form.value;
    alert(`Name: ${name}, Email: ${email}, Message: ${message} `);
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(null),
      email: this.formBuilder.control(null),
      message: this.formBuilder.control(null),
    });
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    const targetId = (event.target as HTMLElement).getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    items:1,
    // navText: ['', ''],
    // responsive: {
    //   0: {
    //     items: 1
    //   },
    //   400: {
    //     items: 1
    //   },
    //   740: {
    //     items: 1
    //   },
    //   940: {
    //     items: 1
    //   }
    // },
    nav: false
  }
  setActive(section: string) {
    this.activeSection = section;
  }

  handleRegisterLinkClick(event: Event) {
   
    event.preventDefault();

    window.open('https://admin.zebetpartners.ng/partner/register', '_blank');
}

handleLoginLinkClick(event: Event) {
   
  event.preventDefault();

  window.open('https://admin.zebetpartners.ng/partner/login', '_blank');
}

}
