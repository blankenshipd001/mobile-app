export type Funko = {
  id?: string; // database ID is auto generated
  name?: string; // Name of the Funko Pop ususally at the bottom of the box
  series?: string; // Series of the Funko Pop, e.g., "Marvel", "Disney"
  number?: string; // The series number of the Funko Pop, e.g., "367"
  barcode?: string; // Barcode of the Funko Pop, e.g., "889698472367"
  image_uri?: string; // the image URI of the Funko Pop, e.g., "https://example.com/image.jpg"
  notes?: string; // Any additional notes about the Funko Pop
  purchase_price?: string; // The price at which the Funko Pop was purchased
};