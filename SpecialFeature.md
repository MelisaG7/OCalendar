**1.6. Add Event Rating System**
Implements a rating system for events, allowing users to provide feedback and help improve event quality.

## User Rating:
Creates a POST endpoint inside the existing event controller that allows users to submit a rating for a specific event. The JSON body should contain the userId, eventId, and a rating (1-5 scale).

## Average Rating Calculation:
Stores each rating in the database and calculate the average rating for each event.
Add the average rating as part of the event response when the event details are fetched.

## Rating Data Model:
Adds a new Rating entity that stores each user's rating, including userId, eventId, rating, and optionally a comment to provide feedback.

## Protected Endpoint:
Ensures that only users who attended an event can rate it. Implement logic to check if a user attended the event before allowing them to submit a rating.

## Admin Overview:
Creates a protected GET endpoint that allows admins to view a summary of all ratings and comments for an event to understand user satisfaction and improve future events.