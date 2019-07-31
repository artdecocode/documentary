{ wiki: '../documentary.wiki' }

## replaces a section brake
%~%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg]]
</a></p>
/**/

## replaces multiple section brakes
%~%

%~%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg]]
</a></p>

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/1.svg]]
</a></p>
/**/

## replaces multiple section brakes when 22 is reached
%~ 22%

%~%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/22.svg]]
</a></p>

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg]]
</a></p>
/**/

## replaces section brake with a href attribute
%~ href="#test"%

/* expected */
<p align="center"><a href="#test">
  [[/.documentary/section-breaks/0.svg]]
</a></p>
/**/

## replaces section brake with a width attribute
%~ width="200"%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg|width=200]]
</a></p>
/**/

## replaces section brake with a negative number
%~ -1%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/-1.svg]]
</a></p>
/**/

## replaces multiple section brake when one is negative
%~%
%~ -1%
%~%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg]]
</a></p>
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/-1.svg]]
</a></p>
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/1.svg]]
</a></p>
/**/

## sets a destination
%~ to=".docs/breaks"%

/* expected */
<p align="center"><a href="#table-of-contents">
  [[/.docs/breaks/0.svg]]
</a></p>
/**/

## replaces a section brake with multiple attributes
%~ width="25" href="#top"%

/* expected */
<p align="center"><a href="#top">
  [[/.documentary/section-breaks/0.svg|width=25]]
</a></p>
/**/