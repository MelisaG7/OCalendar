
using DB;
using Microsoft.AspNetCore.Mvc;


class EndPointManager {
   
   WebApplication app;
   MemoryDB DB;

   public EndPointManager(WebApplication webApp) {
     app = webApp; 
     DB = new MemoryDB();
     DB.Seed();
     
     app.MapGet("/helloworld", () => 
                                {
                                    System.Console.WriteLine("Welcome helloworld");
                                    return Results.Ok("Helloworld!");
                                });
    
           
     app.MapGet("/FetchPerson/", FetchPerson); 
     app.MapGet("/FetchPerson/{id}", FetchPerson); 
     app.MapPost("/AddPerson", AddPerson); 
     app.MapPut("/person", UpSertPerson);
     app.MapDelete("/person/{id}", DeletePerson);
     app.MapDelete("/person/", DeletePerson);
     app.MapPost("/person/friend", AddFriend);
     app.MapGet("/person/friend/", FindFriendsFromQuery);   
     app.MapGet("/person/friend/{id}", FindFriends);  
                           
   }

   private IResult AddPerson(Person p) {
     return Results.Ok(); //remove this line and implement the method
   }

   private IResult FetchPerson(int id) {
     return Results.Ok(); //remove this line and implement the method
   }

   private IResult UpSertPerson(Person p) {
     return Results.Ok(); //remove this line and implement the method  
   }

   private IResult DeletePerson(int id) {
     return Results.Ok(); //remove this line and implement the method
   }

   private void RemoveFriendShips(int id) {
    //  return Results.Ok(); //remove this line and implement the method
   }

   private IResult AddFriend(FriendWith link) {
     return Results.Ok(); //remove this line and implement the method
   }
   
   private IResult FindFriendsFromQuery([FromQuery] int id) {
     return Results.Ok(); //remove this line and implement the method
   }

   private IResult FindFriends(int id) {
          return Results.Ok(); //remove this line and implement the method
   }
}
