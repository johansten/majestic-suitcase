import esbuild from 'esbuild';

try {
  await esbuild.build({
      entryPoints: [
        'build/src/realms/content.js',
      ],
      outdir: 'dist',
      bundle: false, // No dependencies needed
      format: 'esm',
      sourcemap: true,
      target: 'esnext',
      minify: false,
    });

  // Bundle entry points
    await esbuild.build({
        entryPoints: [
          'build/src/realms/background.js',
          'build/src/realms/inpage.js',
        ],
        outdir: 'dist',
        bundle: true, // No bundling, just copy and transform
        format: 'iife',
        sourcemap: true,
        target: 'esnext',
        // Inject Buffer polyfill
        define: { 'global.Buffer': 'Buffer' },
        inject: ['./buffer-shim.js'], // See below
        minify: true,
    });

  // Bundle entry points
    await esbuild.build({
        entryPoints: [
          'build/src/pages/connect.jsx',
          'build/src/pages/sign.jsx'
        ],
        outdir: 'dist',
        bundle: true, // No bundling, just copy and transform
        format: 'iife',
        sourcemap: true,
        target: 'esnext',
        // Inject Buffer polyfill
        define: { 'global.Buffer': 'Buffer' },
        inject: ['./buffer-shim.js'], // See below
        minify: true,
    });
    console.log('Build succeeded!');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
