export declare const PostStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly ARCHIVED: "ARCHIVED";
};
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export declare const CommentStatus: {
    readonly APPROVED: "APPROVED";
    readonly REJECT: "REJECT";
};
export type CommentStatus = (typeof CommentStatus)[keyof typeof CommentStatus];
//# sourceMappingURL=enums.d.ts.map