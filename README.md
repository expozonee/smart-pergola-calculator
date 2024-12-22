# Pergola Price Calculator

A lightweight Next.js application that calculates the price of a pergola based on the selected type, height, and width. The calculator reads data from an Excel file and fetches the correct price from the appropriate table. Users can also provide an optional discount percentage to calculate both the full price and the discounted price.

## Features

- **Dynamic Pergola Selection**: Choose from a list of pergola types.
- **Custom Input for Dimensions**: Enter the height and width of the pergola.
- **Discount Calculation**: 
  - An optional input allows users to provide a discount percentage as a number.
  - The calculator displays both the full price and the discounted price based on the percentage provided.
- **Input Validation**:
  - Height, width, and discount percentage must be numeric values; if not, the form will not submit.
  - Required inputs (height and width) have custom error messages to ensure they are filled before submission.
- **Excel Integration**: Automatically fetches pricing data from an Excel file.
- **Responsive and User-Friendly**: Built with modern design principles for a seamless user experience.

## Technologies Used

- **Next.js**: For building the application and rendering components.
- **React**: For creating reusable UI components.
- **xlsx Library**: For reading data from the Excel file.

## Usage

1. **Select Pergola Type**: From the dropdown menu, choose the type of pergola you want to calculate the price for.
2. **Enter Dimensions**: Provide the height and width of the pergola. 
   - Ensure the values are numeric; non-numeric values will display a validation error.
   - Height and width inputs are required, and custom messages will notify users if fields are left empty.
3. **Optional Discount**: 
   - Provide a discount percentage as a numeric value (optional).
   - If a percentage is entered, the calculator will display the full price and the discounted price.
4. **Calculate**: Click the calculate button, and the app will fetch the price from the Excel file and apply the discount if provided.

## Future Enhancements

- **Enhanced Performance**: Cache Excel data for faster lookups.
