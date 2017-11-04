using Microsoft.EntityFrameworkCore;

namespace ServiceAPI.Dal
{
    public class UniversityDbContext : DbContext
    {
        public DbSet<Student> Students { get; set; }

        public DbSet<Teacher> Teachers { get; set; }

        public DbSet<Teaching> Teachings { get; set; }

        public DbSet<Course> Courses { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => 
            optionsBuilder.UseMySql(@"Server=localhost;database=university;uid=root;");


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Course)
                .WithMany(c => c.Students);

            modelBuilder.Entity<Course>()
               .HasMany(c => c.Teachings)
               .WithOne(t => t.Course);

            modelBuilder.Entity<Teacher>()
               .HasMany(t => t.Teachings)
               .WithOne(tg => tg.Teacher);


            modelBuilder.Entity<Student>().ToTable("StudentInfo");
            modelBuilder.Entity<Teacher>().ToTable("TeacherInfo");
            modelBuilder.Entity<Teaching>().ToTable("TeachingInfo");
            modelBuilder.Entity<Course>().ToTable("CourseInfo");
            
            base.OnModelCreating(modelBuilder);
        }
    }
}
