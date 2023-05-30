export function deleteAddress(address, id) {
  const parsedId = parseInt(id, 10)
  const filteredAddresses = address.filter((address) => address.id !== parsedId)
  return filteredAddresses
}
