import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.modal.js";
import Usermodel from "../models/user.model.js";

export async function createOrderController(req, res) {
  try {
    let order = new OrderModel({
      userId: req.body.userId,
      products: req.body.products,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmt: req.body.totalAmt,
      date: req.body.date,
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Order Not Found",
      });
    }

    // Update product stock for each product in the order
    for (let i = 0; i < req.body.products.length; i++) {
      await ProductModel.findByIdAndUpdate(
        req.body.products[i].productId,
        {
          countInStock: parseInt(
            req.body.products[i].countInStock - req.body.products[i].quantity,
          ),
        },
        { new: true },
      );
    }

    order = await order.save();

    return res.status(200).json({
      error: false,
      success: true,
      message: "Order Placed",
      order: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 5;

    let query = {};
    if (userId) {
      const user = await Usermodel.findById(userId);
      if (user && user.role !== "ADMIN") {
        query = { userId: userId };
      }
    }

    const totalOrders = await OrderModel.countDocuments(query);
    let orderlist = [];
    let totalPages = 1;

    if (page) {
      totalPages = Math.ceil(totalOrders / limit) || 1;
      orderlist = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .populate("delivery_address userId")
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      orderlist = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .populate("delivery_address userId");
      totalPages = Math.ceil(totalOrders / limit) || 1;
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Order list",
      data: orderlist,
      totalOrders: totalOrders,
      totalPages: totalPages,
      page: page || 1,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error fetching orders",
      success: false,
      error: true,
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;

    const { order_status } = req.body;

    const updateOrder = await OrderModel.findByIdAndUpdate(
      id,
      { order_status: order_status },
      { new: true },
    );

    if (!updateOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Status updated",
      success: true,
      error: false,
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getTotalOrdersCountController(req, res) {
  try {
    const ordersCount = await OrderModel.countDocuments();

    return res.status(200).json({
      success: true,
      error: false,
      count: ordersCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function totalSalesController(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const ordersList = await OrderModel.find();

    let totalSales = 0;
    let monthlySales = [
      {
        name: "JAN",
        totalSales: 0,
      },
      {
        name: "FEB",
        totalSales: 0,
      },
      {
        name: "MAR",
        totalSales: 0,
      },
      {
        name: "APR",
        totalSales: 0,
      },
      {
        name: "MAY",
        totalSales: 0,
      },
      {
        name: "JUN",
        totalSales: 0,
      },
      {
        name: "JUL",
        totalSales: 0,
      },
      {
        name: "AUG",
        totalSales: 0,
      },
      {
        name: "SEP",
        totalSales: 0,
      },
      {
        name: "OCT",
        totalSales: 0,
      },
      {
        name: "NOV",
        totalSales: 0,
      },
      {
        name: "DEC",
        totalSales: 0,
      },
    ];

    for (let i = 0; i < ordersList.length; i++) {
      totalSales = totalSales + parseInt(ordersList[i].totalAmt);
      const str = JSON.stringify(ordersList[i]?.createdAt);
      const year = str.substr(1, 4);
      const monthStr = str.substr(6, 8);
      const month = parseInt(monthStr.substr(0, 2));

      if (currentYear == year) {
        if (month === 1) {
          monthlySales[0] = {
            name: "JAN",
            totalSales: (monthlySales[0].totalSales =
              parseInt(monthlySales[0].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 2) {
          monthlySales[1] = {
            name: "FEB",
            totalSales: (monthlySales[1].totalSales =
              parseInt(monthlySales[1].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 3) {
          monthlySales[2] = {
            name: "MAR",
            totalSales: (monthlySales[2].totalSales =
              parseInt(monthlySales[2].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 4) {
          monthlySales[3] = {
            name: "APR",
            totalSales: (monthlySales[3].totalSales =
              parseInt(monthlySales[3].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 5) {
          monthlySales[4] = {
            name: "MAY",
            totalSales: (monthlySales[4].totalSales =
              parseInt(monthlySales[4].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 6) {
          monthlySales[5] = {
            name: "JUN",
            totalSales: (monthlySales[5].totalSales =
              parseInt(monthlySales[5].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 7) {
          monthlySales[6] = {
            name: "JUL",
            totalSales: (monthlySales[6].totalSales =
              parseInt(monthlySales[6].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 8) {
          monthlySales[7] = {
            name: "AUG",
            totalSales: (monthlySales[7].totalSales =
              parseInt(monthlySales[7].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 9) {
          monthlySales[8] = {
            name: "SEP",
            totalSales: (monthlySales[8].totalSales =
              parseInt(monthlySales[8].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 10) {
          monthlySales[9] = {
            name: "OCT",
            totalSales: (monthlySales[9].totalSales =
              parseInt(monthlySales[9].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 11) {
          monthlySales[10] = {
            name: "NOV",
            totalSales: (monthlySales[10].totalSales =
              parseInt(monthlySales[10].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
        if (month === 12) {
          monthlySales[11] = {
            name: "DEC",
            totalSales: (monthlySales[11].totalSales =
              parseInt(monthlySales[11].totalSales) +
              parseInt(ordersList[i].totalAmt)),
          };
        }
      }
    }

    return res.status(200).json({
      success: true,
      error: false,
      totalSales: totalSales,
      monthlySales: monthlySales,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//TotalUsersController
export async function totalUsersController(req, res) {
  try {
    const users = await Usermodel.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {"_id.year": 1, "_id.month":1},
      }
    ]);

     let monthlyUsers = [
      {
        name: "JAN",
        totalSales: 0,
      },
      {
        name: "FEB",
        totalSales: 0,
      },
      {
        name: "MAR",
        totalSales: 0,
      },
      {
        name: "APR",
        totalSales: 0,
      },
      {
        name: "MAY",
        totalSales: 0,
      },
      {
        name: "JUN",
        totalSales: 0,
      },
      {
        name: "JUL",
        totalSales: 0,
      },
      {
        name: "AUG",
        totalSales: 0,
      },
      {
        name: "SEP",
        totalSales: 0,
      },
      {
        name: "OCT",
        totalSales: 0,
      },
      {
        name: "NOV",
        totalSales: 0,
      },
      {
        name: "DEC",
        totalSales: 0,
      },
    ];

    for(let i = 0; i< users.length; i++){
      if(users[i]?._id?.month === 1){
        monthlyUsers[0]= {
          name: 'JAN',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 2){
        monthlyUsers[2]= {
          name: 'FEB',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 3){
        monthlyUsers[2]= {
          name: 'MAR',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 4){
        monthlyUsers[3]= {
          name: 'APR',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 5){
        monthlyUsers[4]= {
          name: 'MAY',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 6){
        monthlyUsers[5]= {
          name: 'JUN',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 7){
        monthlyUsers[6]= {
          name: 'JUL',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 8){
        monthlyUsers[7]= {
          name: 'AUG',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 9){
        monthlyUsers[8]= {
          name: 'SEP',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 10){
        monthlyUsers[9]= {
          name: 'OCT',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 11){
        monthlyUsers[10]= {
          name: 'NOV',
          TotalUsers: users[i].count
        }
      }
       if(users[i]?._id?.month === 12){
        monthlyUsers[11]= {
          name: 'DEC',
          TotalUsers: users[i].count
        }
      }
    }
      return res.status(200).json({
      TotalUsers: monthlyUsers,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}