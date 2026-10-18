@php
    $theme = session('theme', 'dark');
@endphp

<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @vite('resources/js/app.jsx')
        <x-inertia::head />
    </head>
    <body class="theme-{{ $theme }}">
        <x-inertia::app />
    </body>
</html>