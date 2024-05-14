using System;

namespace backend.Models
{
    public class Temperature
    {
        public required string Id { get; set; }
        public required string Value { get; set; }
        public required int FeedId { get; set; }
        public required string FeedKey { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required long CreatedEpoch { get; set; }
        public required DateTime Expiration { get; set; }
    }
}
