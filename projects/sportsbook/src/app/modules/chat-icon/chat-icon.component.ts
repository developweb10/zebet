import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../my-profile/my-profile/profile.service';

@Component({
	selector: 'app-chat-icon',
	templateUrl: './chat-icon.component.html',
	styleUrls: ['./chat-icon.component.css'],
})
export class ChatIconComponent implements OnInit {
	isMobile: boolean = false;

	@Input() isChatVisible: boolean;
	constructor(
		private renderer: Renderer2,
		private route: ActivatedRoute,
		private palyerPropertiesApiUrl: ProfileService
	) {}

	ngOnInit() {
		this.detectViewport();
		// const currentFragment = this.route.snapshot.fragment;
		// if (currentFragment === '#/sports-book') {
		// this.initFreshChat();
		// }
		this.loadFreshchatScript();
	}

	detectViewport() {
		this.isMobile = (window as any).innerWidth < 768;
	}

	loadFreshchatScript() {
		const script = document.createElement('script');
		script.src = 'https://snippets.freshchat.com/js/fc-pre-chat-form-v2.min.js';
		script.async = true;
		document.head.appendChild(script);

		script.onload = () => {
			this.initializeFreshchat();
		};
	}

	initializeFreshchat() {
		const preChatTemplate = {
			SubmitLabel: 'Start Chat',
			fields: {
				'0': {
					error: 'Please Enter a valid name',
					fieldId: 'name',
					label: 'Name',
					required: 'yes',
					type: 'text',
				},
				'1': {
					error: 'Please Enter a valid Email',
					fieldId: 'email',
					label: 'Email',
					required: 'yes',
					type: 'email',
				},
				'2': {
					error: 'Please Enter a valid Phone Number',
					fieldId: 'phone',
					label: 'Phone',
					required: 'no',
					type: 'phone',
				},
			},
			heading: 'Zebet',
			mainbgColor: '#bd1622',
			maintxColor: '#000',
			textBanner:
				"",
		};

		(window as any).fcSettings = {
			token: 'd90391c0-871d-44a3-bc6e-bf5b6b7fd7e7',
			host: 'https://zebet1.freshchat.com',
			config: {
				cssNames: {
					widget: 'custom_fc_frame',
					expanded: 'custom_fc_expanded',
				},
			},
			onInit: () => {
				(window as any).fcPreChatform.fcWidgetInit(preChatTemplate);
			},
		};

		const widgetScript = document.createElement('script');
		widgetScript.src = 'https://zebet1.freshchat.com/js/widget.js';
		widgetScript.async = true;

		widgetScript.onload = () => {
			const observerConfig = { childList: true, subtree: true };
			const callback = (mutationsList, observer) => {
				const freshchatWidget = document.querySelector('.custom_fc_frame');
				if (freshchatWidget) {
					if(!this.isChatVisible) {
						freshchatWidget.classList.add('hidden');
					}
					if(document.documentElement.scrollHeight - document.documentElement.clientHeight !== document.documentElement.scrollTop) {
						freshchatWidget.classList.add('hidden');
					}
					observer.disconnect();
				}
			};
			const observer = new MutationObserver(callback);
			observer.observe(document.body, observerConfig);
		};
	
		document.body.appendChild(widgetScript);
	}

	applyChatIconStyles() {
		const hostElement = document.querySelector('.chat-icon'); // Adjust selector if needed
		if (hostElement) {
			this.renderer.setStyle(hostElement, 'position', 'fixed');
			this.renderer.setStyle(hostElement, 'bottom', '10px');
			this.renderer.setStyle(hostElement, 'z-index', '9999');

			if ((window as any).innerWidth < 768) {
				// For mobile devices
				this.renderer.setStyle(hostElement, 'right', 'unset');
				this.renderer.setStyle(hostElement, 'left', '10px');
			} else {
				// For desktop devices
				this.renderer.setStyle(hostElement, 'left', 'unset');
				this.renderer.setStyle(hostElement, 'right', '10px');
			}
		}
	}

	showHideChatIcon() {
		const fcFrame = document.getElementById('fc_frame');
		if (this.isChatVisible && fcFrame) {
			fcFrame.style.display = 'block';
		} else {
			if (fcFrame) {
				fcFrame.style.display = 'none';
			}
		}
	}

}
