
export class Botellas{

      constructor(_id, name, price, ml = 700, spirit, range = 'recommended'){
        
      this._id = _id// 1, 2, 3...
      this.name = name// makers-mark, cocchi, Patron
      this.price = price
      this.ml = ml// 700 casi siempre
      this.spirit = spirit// whisky, vermouth, gin, tequila ....
      this.range = range // basic, recomended, premium
    
      }
    
    }
