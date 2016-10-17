using System;
using System.ComponentModel.DataAnnotations.Schema;
using Repository.Pattern.Infrastructure;

namespace Repository.Pattern.Ef6
{
    public abstract class DatabaseEntity : IObjectState
    {
        [NotMapped]
        public ObjectState ObjectState { get; set; }

        private DateTime? _createdUtc;
        private DateTime? _modifiedUtc;

        public int CreateUserId { get; set; }

        public DateTime CreatedUtc
        {
            get
            {
                if (_createdUtc == null)
                {
                    _createdUtc = DateTime.UtcNow;
                }
                return _createdUtc.Value;
            }
            private set { _createdUtc = value; }
        }

        public int ModifyUserId { get; set; }

        public DateTime ModifiedUtc
        {
            get
            {
                if (_modifiedUtc == null)
                {
                    _modifiedUtc = DateTime.UtcNow;
                }
                return _modifiedUtc.Value;
            }
            set { _modifiedUtc = value; }
        }
    }
}