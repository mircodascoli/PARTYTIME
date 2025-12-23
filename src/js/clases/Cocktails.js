 export class Cocktail {
    constructor(_id, name, description, image, ingredients=[]) {
          this._id = _id;
          this.name = name;
          this.description = description;
          this.image = image;
          this.ingredients = ingredients;
    
      }
    }