import { FunctionalComponent, Ref } from "preact";
import { memo } from "preact/compat";
import { IPost, IState } from "../types.ts";

interface IPostProps {
  post: IPost;
  locales: IState["locales"];
  measureRef?: Ref<HTMLLIElement>;
}

const Post: FunctionalComponent<IPostProps> = memo(({ post, measureRef }) => {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
  });

  const localizedDate = dateFmt.format(new Date(post.publishedAt));

  return (
    <li
      class="border-t border-gray-400 py-4 px-2 mx-8 list-none"
      ref={measureRef}
    >
      <a
        href={`/${post.id}`}
        class="p-2 flex flex-col sm:flex-row justify-start items-baseline gap-y-2 gap-x-4 group"
      >
        <div class="w-full flex gap-2 justify-between items-center sm:flex-col sm:justify-center sm:w-min">
          <time class="font-plex-mono">{localizedDate}</time>
          {post.tags && post.tags.length > 0 && (
            <div class="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span class="bg-gray-300 text-center text-black font-plex-mono text-sm px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 class="text-lg sm:text-xl tracking-tight font-plex-mono font-semibold group-hover:underline">
            {post.title}
          </h2>
          <p class="pt-1 font-plex-sans text-grey-600 hidden sm:block">
            {post.snippet}
          </p>
        </div>
      </a>
    </li>
  );
});

export default Post;
