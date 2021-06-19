var express =require('express');
var { isAuth, isAdmin } =require('../util');
var router=express.Router();
var {db}=require('../database/database');
router.get('/', async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === 'lowest'
      ? { price: 1 }
      : { price: -1 }
    : { _id: -1 };
    db.all("SELECT * FROM product", [], (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json({rows});
    });
  
});

router.get('/:id', async (req, res) => {
  var params = [req.params.id]
    db.get(`SELECT * FROM product where id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});

router.put('/:id', async (req, res) => {
  db.run(`UPDATE product SET name = ?, price = ?,category=?,countInStock=?,image=? WHERE id = ?`, [req.params.name,req.params.id,req.params.price,req.params.image,req.params.category,req.params.countInStock],function(err){
    if(err){
      res.send("Error encountered while updating");
      return console.error(err.message);
    }
    res.send("Entry updated successfully");
    console.log("Entry updated successfully");
  });
  
});

router.delete('/:id', async (req, res) => {
  db.run(`DELETE FROM product WHERE id = ? `,
  [req.params.id],
  function (err, rows) {
    if (err) {
     res.json({
       message:"Entry not deleted",
       success:false
     })
     }
     res.json({
       success:true,
       message: "Entry deleted"
     });
     console.log("Entry deleted");
  });
});

router.post('/',  async (req, res) => {
  const product={
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    countInStock: req.body.countInStock
  };
  db.run(`INSERT INTO product(name,price,image,category,countInStock) VALUES (?,?,?,?,?)`,[
     product.name,
     product.price,
     product.image,
     product.category,
     product.countInStock,
    ]
 )
  
  
  return res.status(500).send({ message: 'Product created' });
});

module.exports=router; 