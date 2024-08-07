export const getSortQuery = (sortBy) => {
    let sortQuery = null;
    switch (sortBy) {
        case "newest":
            sortQuery = { createdAt: -1, completed: 1 };
            break;
        case "oldest":
            sortQuery = { createdAt: 1, completed: 1 };
            break;
        case "pending":
            sortQuery = { completed: 1, createdAt: -1 };
            break;
        case "completed":
            sortQuery = { completed: -1, createdAt: -1 };
            break;
        default:
            sortQuery = { createdAt: -1, completed: 1 };
            break;
    }
    return sortQuery;
};
