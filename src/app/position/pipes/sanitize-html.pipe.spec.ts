import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import {  TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

describe('SanitizeHtmlPipe', () => {
  let domSanitizer;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
    domSanitizer = TestBed.inject(DomSanitizer);
  });

  it('create an instance and test html transform', () => {
    const pipe = new SanitizeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
    const transformedText = pipe.transform('<h1> Testing </h1>', 'html');
    const sanitizedValue = domSanitizer.sanitize(SecurityContext.HTML, transformedText);
    expect(sanitizedValue).toBe('<h1> Testing </h1>');
  });
});
