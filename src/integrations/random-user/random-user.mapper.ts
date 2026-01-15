export function mapRandomUserToLead(user: any) {
  return {
    firstName: user.name.first,
    lastName: user.name.last,
    email: user.email,
    phone: user.phone,
    country: user.location.country,
    source: 'external' as const
  }
}
