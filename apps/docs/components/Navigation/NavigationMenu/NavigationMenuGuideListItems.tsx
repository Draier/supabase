import * as Accordion from '@radix-ui/react-accordion'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/legacy/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import MenuIconPicker from './MenuIconPicker'

const HeaderLink = React.memo(function HeaderLink(props: {
  title: string
  id: string
  url: string
}) {
  const pathname = usePathname()

  return (
    <span
      className={[
        ' ',
        !props.title && 'capitalize',
        props.url === pathname ? 'text-brand' : 'hover:text-brand text-foreground',
      ].join(' ')}
    >
      {props.title ?? props.id}
    </span>
  )
})

const ContentAccordionLink = React.memo(function ContentAccordionLink(props: any) {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const activeItem = props.subItem.url === pathname
  const activeItemRef = useRef<HTMLLIElement>(null)

  const LinkContainer = (props) => {
    const isExternal = props.url.startsWith('https://')

    return (
      <Link
        href={props.url}
        className={props.className}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {props.children}
      </Link>
    )
  }

  useEffect(() => {
    // scroll to active item
    if (activeItem && activeItemRef.current) {
      // this is a hack, but seems a common one on Stackoverflow
      setTimeout(() => {
        activeItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 0)
    }
  })
  return (
    <>
      {props.subItemIndex === 0 && (
        <>
          <div className="h-px w-full bg-border my-3"></div>
          <span className="font-mono text-xs uppercase text-foreground font-medium tracking-wider">
            {props.parent.name}
          </span>
        </>
      )}
      <Accordion.Item key={props.subItem.label} value={props.subItem.url}>
        <li key={props.subItem.name} ref={activeItem ? activeItemRef : null}>
          <LinkContainer
            url={props.subItem.url}
            className={[
              'flex items-center gap-2',
              'cursor-pointer transition text-sm',
              activeItem
                ? 'text-brand font-medium'
                : 'hover:text-foreground text-foreground-lighter',
            ].join(' ')}
            parent={props.subItem.parent}
          >
            {props.subItem.icon && (
              <Image
                alt={props.subItem.name}
                src={`${props.subItem.icon}${!resolvedTheme?.includes('dark') ? '-light' : ''}.svg`}
                width={15}
                height={15}
              />
            )}
            {props.subItem.name}
          </LinkContainer>
        </li>

        {props.subItem.items && props.subItem.items.length > 0 && (
          <Accordion.Content className="transition data-open:animate-slide-down data-closed:animate-slide-up ml-2">
            {props.subItem.items.map((subSubItem) => {
              return (
                <li key={props.subItem.name}>
                  <Link
                    href={`${subSubItem.url}`}
                    className={[
                      'cursor-pointer transition text-sm',
                      subSubItem.url === pathname
                        ? 'text-brand'
                        : 'hover:text-brand text-foreground-lighter',
                    ].join(' ')}
                  >
                    {subSubItem.name}
                  </Link>
                </li>
              )
            })}
          </Accordion.Content>
        )}
      </Accordion.Item>
    </>
  )
})

const ContentLink = React.memo(function ContentLink(props: any) {
  const pathname = usePathname()

  return (
    <li className="mb-1.5">
      <Link
        href={props.url}
        className={[
          'cursor-pointer transition text-sm',
          props.url === pathname
            ? 'text-brand-link'
            : 'hover:text-foreground text-foreground-lighter',
        ].join(' ')}
      >
        {props.icon && (
          <Image alt={props.icon} width={12} height={12} src={`${pathname}${props.icon}`} />
        )}
        {props.name}
      </Link>
    </li>
  )
})

const Content = (props) => {
  const { menu, id } = props

  return (
    <ul className={['relative w-full flex flex-col gap-0 pb-5'].join(' ')}>
      <Link href={menu.url ?? ''}>
        <div className="flex items-center gap-3 my-3 text-brand-link">
          <MenuIconPicker icon={menu.icon} />
          <HeaderLink title={menu.title} url={menu.url} id={id} />
        </div>
      </Link>

      {menu.items.map((x) => {
        return (
          <div key={x.name}>
            {x.items && x.items.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {x.items.map((subItem, subItemIndex) => {
                  return (
                    <ContentAccordionLink
                      key={subItem.name}
                      subItem={subItem}
                      subItemIndex={subItemIndex}
                      parent={x}
                    />
                  )
                })}
              </div>
            ) : x.url ? (
              <ContentLink url={x.url} icon={x.icon} name={x.name} key={x.name} />
            ) : null}
          </div>
        )
      })}
    </ul>
  )
}

export default React.memo(Content)
