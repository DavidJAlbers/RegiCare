/**
 * The data model for Docker repositories, the main object RegiCare deals with.
 */
export default interface Repository {
    name: string,
    tags: string[],
    modified: string,
    architecture: string
}