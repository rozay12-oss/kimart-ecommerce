/**
 * Calculations for Product Inventory Analytics
 */

export const calculateInventoryStats = (products = []) => {
  const totalProducts = products.length;

  // Total value of all items in the warehouse
  const totalStockValue = products.reduce((sum, item) => {
    return sum + (Number(item.price || 0) * Number(item.stock || 0));
  }, 0);

  // Items with 5 or less in stock
  const lowStockItems = products.filter(item => item.stock > 0 && item.stock <= 5).length;

  // Items with exactly 0 in stock
  const outOfStockItems = products.filter(item => item.stock === 0).length;

  return {
    totalProducts,
    totalStockValue,
    lowStockItems,
    outOfStockItems
  };
};