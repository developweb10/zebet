import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
})
export class NotificationComponent implements OnInit {
  selectedDate: Date | null;
  notificationProperties: any[] = [];
  showNoRecordsMessage = false;
  selectedNotification: any ;
  flaggedOnly: boolean = false;
  notification: any; 

  constructor(private notificationService: NotificationService, private route: ActivatedRoute, private dialogRef: MatDialogRef<NotificationComponent>) {}

  ngOnInit(): void {
    this.getNotificationProperties();
  }

  getToday(): Date {
    
    return new Date();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.getNotificationProperties();
  }

  getNotificationProperties(): void {
    this.notificationService.getNotificationProperties().subscribe(
      (data) => {
        // Filter the notifications based on the selected date

        this.notificationProperties = this.filterNotificationsByDate(data);

        if (this.flaggedOnly) {
          this.notificationProperties = this.notificationProperties.filter(notification => notification.flagged);
        }
  
        // console.log('Filtered Notification Properties:', this.notificationProperties);
        this.showNoRecordsMessage = this.selectedDate !== null && this.notificationProperties?.length === 0;
      

      },
      (error) => {
        console.error('Error fetching notification properties:', error);
      }
    );
  }

  filterNotificationsByDate(notifications: any[]): any[] {
    // If no date is selected, show all data
    if (!this.selectedDate) {
      return notifications;
    }

    // Filter notifications where placedOn date matches the selected date
    return notifications.filter((notification) =>
      this.isSameDate(new Date(notification.message.placedOn), this.selectedDate)
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  deleteNotification(id: string): void {
    this.notificationService.getNotificationDelete(id).subscribe(
        () => {
            // console.log('Notification deleted successfully');
            // Update the notificationProperties after successful deletion
            this.getNotificationProperties();
            // Reset the selectedNotification after deletion
            this.selectedNotification = null;
        },
        (error) => {
            console.error('Error deleting notification:', error);
        }
    );
}


toggleMessageDetails(notification: any): void {
  const notificationId = notification.id;
  const apiUrl = `/inbox/notification/seen`;
  this.notificationService.markAsSeen(apiUrl, notificationId).subscribe(
    () => {
      // Update the local notificationProperties array to reflect the change
      notification.seen = true;
      this.selectedNotification = this.selectedNotification === notification ? null : notification;
      this.notificationService.triggerUpdate();
    },
    (error) => {
      console.error('Error marking message as seen:', error);
    }
  );
}


  flagNotification(notificationId: number): void {
    const apiUrl = `/inbox/notification/${notificationId}/flag`;
  
    this.notificationService.flagNotification(apiUrl).subscribe(
      () => {
        // Update the local notificationProperties array to reflect the change
        const notification = this.notificationProperties.find(n => n.id === notificationId);
        if (notification) {
          notification.flagged = !notification.flagged; // Toggle the flagged status
        }
      },
      (error) => {
        console.error('Error updating flagged status:', error);
      }
    );
  }
  
  
  onFlaggedOnlyChange(event: any): void {
    this.flaggedOnly = event.target.value === 'Flagged only';
    this.getNotificationProperties();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
}

