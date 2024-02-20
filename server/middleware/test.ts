export default defineEventHandler((event) => {
  console.log('New request: ', event.node.res)
})