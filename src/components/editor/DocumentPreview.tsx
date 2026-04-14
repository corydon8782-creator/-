'use client'

import React from 'react'
import { QualityDocument, DocumentSection, TextContent, TableContent, TestItemsContent, OverviewContent, OrganizationContent, ApprovalBox } from '@/lib/types'

interface DocumentPreviewProps {
  document: QualityDocument
}

function ApprovalBoxPreview({ box }: { box: ApprovalBox }) {
  return (
    <div className={`flex ${box.position.includes('right') ? 'justify-end' : 'justify-center'} mb-4`}>
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th
              className="border border-slate-700 bg-slate-100 px-8 py-1 text-center font-bold text-slate-800"
              colSpan={box.rows[0]?.cells.length ?? 1}
            >
              {box.title}
            </th>
          </tr>
        </thead>
        <tbody>
          {box.rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, i) => (
                <td
                  key={cell.id}
                  className="border border-slate-700 px-5 py-1 text-center align-top min-w-[70px]"
                  colSpan={cell.colSpan}
                >
                  <div className="font-semibold text-slate-800 border-b border-slate-400 pb-0.5 mb-0.5 text-center">{cell.title}</div>
                  <div className="h-10" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionPreview({ section }: { section: DocumentSection }) {
  if (!section.isVisible) return null

  return (
    <div className="mb-6">
      {section.type !== 'title' && (
        <h2 className="text-[11pt] font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-3">
          {section.title}
        </h2>
      )}

      {section.content.kind === 'text' && (
        <div
          className="text-[10pt] text-slate-800 leading-relaxed whitespace-pre-line"
          style={{ textIndent: '0' }}
        >
          {(section.content as TextContent).body}
        </div>
      )}

      {section.content.kind === 'overview' && (
        <table className="w-full border-collapse text-[9pt]">
          <tbody>
            {(section.content as OverviewContent).fields.map((f, i) => (
              <tr key={i}>
                <th
                  className="border border-slate-500 bg-slate-100 px-3 py-1.5 text-left font-semibold text-slate-700 w-1/4"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {f.label}
                </th>
                <td className="border border-slate-500 px-3 py-1.5 text-slate-800">
                  {f.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {section.content.kind === 'organization' && (
        <table className="w-full border-collapse text-[9pt]">
          <thead>
            <tr>
              {['직위/직책', '성명', '자격/면허', '비고'].map((h) => (
                <th
                  key={h}
                  className="border border-slate-500 bg-slate-100 px-3 py-1.5 text-center font-semibold text-slate-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(section.content as OrganizationContent).members.map((m) => (
              <tr key={m.id}>
                <td className="border border-slate-500 px-3 py-1.5 font-medium">{m.role}</td>
                <td className="border border-slate-500 px-3 py-1.5">{m.name}</td>
                <td className="border border-slate-500 px-3 py-1.5 text-slate-500">{m.qualification}</td>
                <td className="border border-slate-500 px-3 py-1.5 text-slate-500">{m.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {section.content.kind === 'table' && (
        <div>
          {(section.content as TableContent).caption && (
            <p className="text-[9pt] font-semibold text-slate-700 mb-1">
              {(section.content as TableContent).caption}
            </p>
          )}
          <table className="w-full border-collapse text-[9pt]">
            <thead>
              <tr>
                {(section.content as TableContent).headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-slate-500 bg-slate-100 px-3 py-1.5 text-center font-semibold text-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(section.content as TableContent).rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-slate-500 px-3 py-1.5 text-slate-800">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.content.kind === 'test_items' && (
        <table className="w-full border-collapse text-[8.5pt]">
          <thead>
            <tr>
              {['번호', '공종', '시험 항목', '시험 방법', '시험 빈도', '합격 기준', '비고'].map((h) => (
                <th
                  key={h}
                  className="border border-slate-500 bg-slate-100 px-2 py-1.5 text-center font-semibold text-slate-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(section.content as TestItemsContent).items.map((item, i) => (
              <tr key={item.id}>
                <td className="border border-slate-500 px-2 py-1.5 text-center text-slate-600">{i + 1}</td>
                <td className="border border-slate-500 px-2 py-1.5 text-slate-700">{item.workType}</td>
                <td className="border border-slate-500 px-2 py-1.5 font-medium text-slate-800">{item.itemName}</td>
                <td className="border border-slate-500 px-2 py-1.5 text-slate-600 text-[8pt]">{item.testMethod}</td>
                <td className="border border-slate-500 px-2 py-1.5 text-slate-600 text-[8pt]">{item.frequency}</td>
                <td className="border border-slate-500 px-2 py-1.5 text-slate-600 text-[8pt]">{item.standard}</td>
                <td className="border border-slate-500 px-2 py-1.5 text-slate-500 text-[8pt]">{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function DocumentPreview({ document }: DocumentPreviewProps) {
  const titleSection = document.sections.find((s) => s.type === 'title')
  const otherSections = document.sections.filter((s) => s.type !== 'title').sort((a, b) => a.order - b.order)
  const isTopRight = document.approvalBox.position === 'top-right'

  return (
    <div className="document-preview">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-slate-800">
        <div>
          <p className="text-[8pt] text-slate-500">{document.headerInfo.companyName}</p>
          <p className="text-[8pt] text-slate-500">
            문서번호: {document.headerInfo.documentNo} | 개정번호: {document.headerInfo.revision} | 작성일: {document.headerInfo.date}
          </p>
        </div>
      </div>

      {/* Approval box (top-right) */}
      {isTopRight && <ApprovalBoxPreview box={document.approvalBox} />}

      {/* Document title */}
      {titleSection && (
        <div className="text-center mb-8">
          <h1 className="text-[16pt] font-bold text-slate-900 leading-tight whitespace-pre-line">
            {(titleSection.content as TextContent).body}
          </h1>
        </div>
      )}

      {/* Sections */}
      {otherSections.map((section) => (
        <SectionPreview key={section.id} section={section} />
      ))}

      {/* Approval box (bottom) */}
      {!isTopRight && <ApprovalBoxPreview box={document.approvalBox} />}

      {/* Footer */}
      <div className="mt-8 pt-2 border-t border-slate-400 flex justify-between text-[8pt] text-slate-500">
        <span>{document.footerInfo.leftText}</span>
        <span>{document.footerInfo.rightText}</span>
      </div>
    </div>
  )
}
