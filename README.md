# jzbuilder

(https://jmickle66666666.github.io/jzbuilder/)

# what

JZBuilder is a map editor for Doom, built for the web!

# why

While the various existing Doom map editors are fantastic at what they do, they have various levels of inaccesibility and techinical limitations as to what is possible with them. JZBuilder is built with typescript and doesn't work with Doom map data directly, allowing many new possibilities when it comes to creating maps.

Using a javascript-based approach means extending the editor is as simple as opening the console. Since javascript is the most commonly used language in use today, this allows many more contributors to extend or work with the project. 

Using a compeletely separated data representation from Doom's map data allows a huge range of possibilities with editor functionality. The already-introduced Edge Modifiers, and non-destructive would not be possible without an explicit compilation/export step. Hopefully over time even more exciting features will be created because of this, too.

# goals

I aim to keep the project setup as simple as possible, so that people can dive in quickly and easily, and play around with the app. Using typescript instead of pure javascript is a decision to aide development at the cost of having a compile step. I think for an application of this complexity I believe it is a good balance between ease of use and ease of setup.

# how

To use JZBuilder, just head to (https://jmickle66666666.github.io/jzbuilder/) and get going!

To develop JZBuilder, you need to install [typescript](https://www.typescriptlang.org/).
To compile, just run `tsc` in the root directory (where `tsconfig.json` is located).
Load up `index.html` to try it out! It runs locally just fine.

# license

no license yet. three.min.js and wad-js are under the MIT license.
