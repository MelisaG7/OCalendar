using System.Collections.Generic;

namespace DB {

    public record Person(int Id, string? Name, int Age);
    public record FriendWith(int FromId, int ToId);
    
    public class MemoryDB 
    {
        public List<Person> Persons {get; set;}
        public List<FriendWith> Friendships {get; set;}

        public MemoryDB() {
            Persons = new List<Person>();
            Friendships = new List<FriendWith>();       
        }

        public void Seed()
        {
            Persons.AddRange(new Person[]
                {
                    new Person(1, "Ernest Hemingway", 50 ),
                    new Person(2, "Peter Jackson", 62 ),
                    new Person(3, "Harrison Ford",78 ),
                }
            );
        }
    }
}