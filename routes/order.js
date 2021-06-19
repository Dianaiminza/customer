var express =require ('express');
var  Order =require ('../models/orderModel');
var { isAuth, isAdmin } =require('../util');
var router=express.Router();
router.get("/", async (req, res) => {
    db.all("SELECT * FROM order", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({rows});
      });
});
router.get("/mine", async (req, res) => {
    db.all("SELECT * FROM order where id=? AND userid=?", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({rows});
      });
});

router.get("/:id", async (req, res) => {
    var params = [req.params.id]
    db.get(`SELECT * FROM order where id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});

router.delete("/:id",  async (req, res) => {
    db.run(`DELETE FROM order WHERE id = ? `,
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
    })
});

router.post("/",  async (req, res) => {
    const order={
        orderItems: req.body.orderItems,
        user: req.body.user,
        payment: req.body.payment,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice
      };
      db.run(`INSERT INTO order(orderItems,user,payment,itemsPrice,taxPrice,totalPrice) VALUES (?,?,?,?,?,?)`,[
       order.orderItems,
        order.user,
        order.payment,
        order.itemsPrice,
        order.taxPrice
        ]
     )
      
      return res.status(500).send({ message: 'Order created' });
});



module.exports=router; 