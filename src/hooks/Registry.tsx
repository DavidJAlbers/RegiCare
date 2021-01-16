/**
 * A hook that returns information about the targeted Docker registry.
 * The `registry` field contains the registry's domain name and the `admin` field may contain a web or e-mail address for contact.
 */
export default function useRegistry(): { registry: string, admin?: string } {

    // TODO Think of a proper source to get these from
    const registry = "registry.davidjalbers.de"
    const admin = "mailto:david.j.albers@outlook.de"

    return { registry, admin }
}