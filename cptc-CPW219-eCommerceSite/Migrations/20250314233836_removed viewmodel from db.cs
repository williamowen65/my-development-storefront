using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cptc_CPW219_eCommerceSite.Migrations
{
    /// <inheritdoc />
    public partial class removedviewmodelfromdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "ProductViewModel",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "ProductViewModel");
        }
    }
}
