export default defineEventHandler(async (event) => {
  console.log(JSON.stringify(event.node.res.getHeaders()));
})