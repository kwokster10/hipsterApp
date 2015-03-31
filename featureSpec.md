# Feature Specs for Genevieve

###This is how the app works 

1. The server will display a welcome message upon connection. 

2. If there is an event set up, the amount of people already attending and also if they would like to RSVP to the event will be displayed after. The order for it will be: RSVP first_name surname email. The server will check for the keyword RSVP along with amount of information before saving. Otherwise, an error message will appear. 

3. If an event has not been set up, the client will be notified to check back later. 

4. Once they have entered their information properly, it will remind them to save the date along with an updated number of attendees. 

5. In order to change the date and topic, you'll need this specific key: 2556//date/topic//
   Replace the 'date' with your 'new_date' and the 'topic' with your 'new_topic'.
    **Take care to put the above key and all of below keys in the right order, with no spaces, with the correct amount of slashes, and in lowercase! Only you will know these. An easy way to remember the number is to think BKLN for the number pad.

6. If you want to see who are attending, type: 2556//attendee/list//

7. When your event has finished and you want to clear your RSVP list, type: 2556//clear/rsvps//

8. If the inputs aren't understood an error message will appear for re-input. 

####Hope your events go well! 






